import { KeepAlive, history } from 'umi';

export default (props) => {
  return (
    <KeepAlive
      saveScrollPosition="screen"
      when={() => {
        // 根据路由的前进和后退状态去判断页面是否需要缓存，前进时缓存，后退时不缓存（卸载）。 when中的代码是在页面离开（卸载）时触发的。
        return history.action != 'REPLACE'; //true卸载时缓存，false卸载时不缓存
      }}
    >
      <div>{props.children}</div>
    </KeepAlive>
  );
};
