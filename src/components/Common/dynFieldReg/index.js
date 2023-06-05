import React from 'react';
import { language } from '@/utils/language';
import { regList } from '@/utils/regExp';

export default function DynFieldReg(type = '', status = 'N') {
  let reg = '';
  if (type == 'digital') {
    reg = [{ required: status == 'Y' ? true : false, pattern: regList.numPattern.regex, message: regList.numPattern.alertText, }]
  } else if (type == 'tel') {
    reg = [{ required: status == 'Y' ? true : false, pattern: regList.phoneorlandline.regex, message: regList.phoneorlandline.alertText, }]
  } else if (type == 'email') {
    reg = [{ required: status == 'Y' ? true : false, pattern: regList.email.regex, message: regList.email.alertText, }]
  } else {
    reg = [{ required: status == 'Y' ? true : false, message: language('project.pleasefill') }];
  }
  return reg;
}