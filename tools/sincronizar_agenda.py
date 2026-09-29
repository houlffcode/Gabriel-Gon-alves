from __future__ import annotations
import json, re, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'assets'/'data'
CFG=json.loads((DATA/'agenda-config.json').read_text(encoding='utf-8'))

def unfold(text):
    out=[]
    for line in text.replace('\r\n','\n').replace('\r','\n').split('\n'):
        if line.startswith((' ','\t')) and out: out[-1]+=line[1:]
        else: out.append(line)
    return out

def unescape(s):
    return (s or '').replace('\\n','\n').replace('\\N','\n').replace('\\,',',').replace('\\;',';').replace('\\\\','\\')

def dtparse(raw, all_day=False):
    raw=raw.strip()
    if re.fullmatch(r'\d{8}',raw):
        return datetime.strptime(raw,'%Y%m%d').replace(tzinfo=timezone(timedelta(hours=-3))), True
    if raw.endswith('Z'):
        return datetime.strptime(raw,'%Y%m%dT%H%M%SZ').replace(tzinfo=timezone.utc), False
    d=datetime.strptime(raw[:15],'%Y%m%dT%H%M%S')
    return d.replace(tzinfo=timezone(timedelta(hours=-3))), False

def iso(d): return d.isoformat()
def cat(title,desc):
    s=(title+' '+desc).lower()
    if any(x in s for x in ['reuni','encontro']): return ('reuniao' if 'reuni' in s else 'encontro', 'Reunião' if 'reuni' in s else 'Encontro')
    return ('atividade','Atividade')
def safe_id(uid): return re.sub(r'[^a-zA-Z0-9._-]+','-',uid).strip('-')[:120] or 'evento'
def google_link(e):
    st=e['start'].astimezone(timezone.utc); en=e['end'].astimezone(timezone.utc)
    fmt='%Y%m%d' if e['allDay'] else '%Y%m%dT%H%M%SZ'
    dates=(st.strftime(fmt)+'/'+en.strftime(fmt))
    q={'action':'TEMPLATE','text':e['title'],'dates':dates,'details':e['description'],'location':e['location']}
    return 'https://calendar.google.com/calendar/render?'+urllib.parse.urlencode(q)

def ics_event(e,path):
    def esc(v): return (v or '').replace('\\','\\\\').replace(',','\\,').replace(';','\\;').replace('\n','\\n')
    if e['allDay']:
        ds=e['start'].strftime('%Y%m%d'); de=e['end'].strftime('%Y%m%d')
        dts=f'DTSTART;VALUE=DATE:{ds}\nDTEND;VALUE=DATE:{de}'
    else:
        ds=e['start'].astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ'); de=e['end'].astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
        dts=f'DTSTART:{ds}\nDTEND:{de}'
    txt=f'''BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Agenda Publica//PT-BR\nBEGIN:VEVENT\nUID:{esc(e['uid'])}\n{dts}\nSUMMARY:{esc(e['title'])}\nDESCRIPTION:{esc(e['description'])}\nLOCATION:{esc(e['location'])}\nEND:VEVENT\nEND:VCALENDAR\n'''
    path.write_text(txt,encoding='utf-8')

url=CFG['publicIcalUrl']
with urllib.request.urlopen(url, timeout=20) as r: text=r.read().decode('utf-8-sig','replace')
lines=unfold(text); events=[]; cur=None
for line in lines:
    if line=='BEGIN:VEVENT': cur={}; continue
    if line=='END:VEVENT' and cur is not None:
        try:
            start_key=next(k for k in cur if k.startswith('DTSTART'))
            end_key=next((k for k in cur if k.startswith('DTEND')),None)
            st,ad=dtparse(cur[start_key], 'VALUE=DATE' in start_key)
            if end_key: en,_=dtparse(cur[end_key], 'VALUE=DATE' in end_key)
            else: en=st+(timedelta(days=1) if ad else timedelta(hours=1))
            title=unescape(cur.get('SUMMARY','Compromisso')); desc=unescape(cur.get('DESCRIPTION','')); loc=unescape(cur.get('LOCATION',''))
            c,cl=cat(title,desc); uid=cur.get('UID',f'{title}-{st.isoformat()}'); eid=safe_id(uid)
            events.append({'uid':uid,'id':eid,'title':title,'description':desc,'location':loc,'start':st,'end':en,'allDay':ad,'category':c,'categoryLabel':cl})
        except Exception as ex: print('[AVISO] Evento ignorado:',ex)
        cur=None; continue
    if cur is not None and ':' in line:
        k,v=line.split(':',1); cur[k]=v
now=datetime.now(timezone.utc)
events=[e for e in events if (not CFG.get('hidePastEvents',True) or e['end'].astimezone(timezone.utc)>=now)]
events.sort(key=lambda e:e['start']); events=events[:int(CFG.get('maxEvents',30))]
out_events=[]; evdir=DATA/'events'; evdir.mkdir(parents=True,exist_ok=True)
for e in events:
    p=evdir/(e['id']+'.ics'); ics_event(e,p)
    out_events.append({'id':e['id'],'title':e['title'],'description':e['description'],'location':e['location'],'start':iso(e['start']),'end':iso(e['end']),'allDay':e['allDay'],'category':e['category'],'categoryLabel':e['categoryLabel'],'addToCalendar':google_link(e),'ics':'assets/data/events/'+p.name})
out={'updatedAt':datetime.now(timezone.utc).isoformat(),'calendarName':CFG['calendarName'],'publicCalendarUrl':CFG.get('publicCalendarUrl',''),'events':out_events}
(DATA/'agenda.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(f"[OK] {len(out_events)} eventos publicados em {DATA/'agenda.json'}")
