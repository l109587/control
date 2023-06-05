import adminacc from './adminacc';
import resmngt  from './resmngt';
import temporary from './temporary';
import mconfig from './mconfig';
import sysconf from './sysconf';
import monitor from './monitor';
import logmngt from './logmngt';
import analyse from './analyse';
import central from './central';
import nbg from './nbg';
import assmngt from './assmngt';
import regexp from './regexp';
import sysdebug from './sysdebug';
import sysmain from './sysmain';
import cfgmngt from './cfgmngt';
import tacindex from './tacindex';
import illevent from './illevent';
import monconf from './monconf';
import alarmdt from './alarmdt';
import dmcmconfig from './dmcmconfig';
import ntanetaudit from './ntanetaudit';
import prbmgt from './prbmgt';
import netanalyse from './netanalyse';

export default {
    ...adminacc,
    ...resmngt,
    ...temporary,
    ...mconfig,
    ...sysconf,
    ...monitor,
    ...logmngt,
    ...analyse,
    ...central,
    ...nbg,
    ...assmngt,
    ...regexp,
    ...sysdebug,
    ...sysmain,
    ...cfgmngt,
    ...tacindex,
    ...illevent,
    ...monconf,
    ...alarmdt,
    ...dmcmconfig,
    ...ntanetaudit,
    ...prbmgt,
    ...netanalyse
}