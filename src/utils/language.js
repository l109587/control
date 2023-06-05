import React from 'react';
import { getIntl } from 'umi';

export const language = (key, dynamicContent = {}) => {
    // let init = useIntl();
    let init = getIntl();
    return  init.formatMessage({id:key},dynamicContent);
}
    