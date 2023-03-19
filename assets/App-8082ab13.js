import{U as i,s as n,z as o,c as t,j as e,V as a,r,_ as s,a as d,u as l,b as c,d as u,F as h,e as m,H as f,T as p,M as g}from"./index-f3c0bad0.js";const b=i`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`,x={Container:n.div`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: ${o};

    > div {
      animation: ${b} 1s infinite;
      color: ${t.WHITE};
    }
  `};function $(){return e(x.Container,{children:e("div",{children:e(a,{size:75})})})}const X=r.lazy((()=>s((()=>import("./index-f3c0bad0.js").then((i=>i.S))),["assets/index-f3c0bad0.js","assets/index-be6ca56e.css"]))),_=r.lazy((()=>s((()=>import("./index-f3c0bad0.js").then((i=>i.C))),["assets/index-f3c0bad0.js","assets/index-be6ca56e.css"]))),C={Background:n.div`
    background-color: ${({theme:i})=>i.bg};
    height: 100%;
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,Container:n.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${d.XXXS};
  `,PermissionContainer:n.div`
    background-color: ${t.WHITE};
    border-radius: 5px;
    bottom: 0;
    color: ${t.BLACK};
    max-height: 200px;
    max-width: 200px;
    padding: ${d.XS};
    position: fixed;
    right: 0;
    transform: translate(-50%, -50%);
    width: 100%;

    > h2 {
      margin-bottom: ${d.XXXS};
    }

    > button {
      all: unset;
      background-color: ${t.BLACK};
      border-radius: 3px;
      color: ${t.WHITE};
      cursor: pointer;
      font-size: 12px;
      padding: ${d.XXXXS};

      &:focus-visible {
        outline: auto;
      }
    }
  `};function k(){const i=l((i=>i.currentTimerName)),n=c((i=>i.openedModal)),o=u((i=>i.config.theme)),[a,s]=r.useState(!0);return e(h,{theme:{bg:o.colorThemes[i],text:t.WHITE},children:m(C.Background,{children:[m(C.Container,{children:[e(f,{}),m("main",{children:[e(p,{}),"settings"===n?e(g,{children:e(r.Suspense,{fallback:e($,{}),children:e(X,{})})}):null,"colors"===n?e(g,{children:e(r.Suspense,{fallback:e($,{}),children:e(_,{})})}):null]})]}),"Notification"in window&&"default"===Notification.permission&&a?m(C.PermissionContainer,{role:"dialog","aria-labelledby":"notification-dialog-label",children:[e("h2",{id:"notification-dialog-label",children:"Allow Notification?"}),e("button",{type:"button",onClick:()=>{Notification.requestPermission(),s(!1)},children:"Open notification menu"})]}):null]})})}export{k as default};
