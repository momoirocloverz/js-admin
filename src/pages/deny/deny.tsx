import './deny.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { Input, message, Radio, Tabs } from 'antd';

const DenyPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;

    return (
        <div className="flex">
            <img src="https://img.hzanchu.com/acimg/707f7a7cdd1b8e922ffcbfe572b303a9.png" />
            您暂时没有权限，请联系管理员分配权限！
        </div>
    );
}

export default connect(({ baseModel }) => ({ baseModel }))(DenyPage);