import React from 'react';
import { Card } from 'antd';
const { Meta } = Card;

export function InfoCard({ data, width, size }) {
  return (
    <Card size={size} hoverable style={{ width }} cover={data.cover}>
      <Meta key={data.desc} description={data.desc} />
    </Card>
  );
}

function InfoCardList({ list, width = '100px', cardSize = 'small' }: any) {
  return (
    <div style={{ display: 'flex', columnGap: '12px', padding: '20px' }}>
      {list?.map((e: any) => (
        <InfoCard key={e.id} data={e} width={width} size={cardSize} />
      ))}
      {(!list || list.length === 0) && '无内容'}
    </div>
  );
}

export default React.memo(InfoCardList);
