import React, { useState } from 'react';
import { Radio } from 'antd';
import Styles from './index.less';

type TableRadioProps = {
  radioArray?: Array<RadioItemProps>;
  defaultValue?: string | number;
  spotIndex?: string | number;
  spotCount?: string | number;
  onRadioChange?: (params: any) => void;
};

export type RadioItemProps = {
  label: string;
  value: string | number;
};

function TableRadio(props: TableRadioProps) {
  const { radioArray, defaultValue, onRadioChange, spotIndex, spotCount } =
    props;
  const [innerDefaultValue, setInnerDefaultValue] = useState(
    defaultValue ?? radioArray![0].value,
  );

  const onChange = (e: any) => {
    // console.log(e.target.value);
    onRadioChange?.(e.target.value);
  };
  return (
    <div className={Styles.tableRadioContainer}>
      <Radio.Group onChange={onChange} defaultValue={innerDefaultValue}>
        {radioArray?.map((item, index) => (
          <Radio.Button value={item.value} key={item.value}>
            {item.label}
            {spotIndex == index && spotCount ? (
              <div className={Styles.tag}>{spotCount}</div>
            ) : null}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
}

export default TableRadio;
