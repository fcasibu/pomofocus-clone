import{U as i,s as n,z as o,c as e,j as t,V as a,r,_ as s,a as d,u as l,b as c,d as u,F as h,e as m,H as p,T as f,M as g}from"./index-cad64f5e.js";const b=i`
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
      color: ${e.WHITE};
    }
  `};function $(){return t(x.Container,{children:t("div",{children:t(a,{size:75})})})}const X=r.lazy((()=>s((()=>import("./index-cad64f5e.js").then((i=>i.S))),["assets/index-cad64f5e.js","assets/index-be6ca56e.css"]))),_=r.lazy((()=>s((()=>import("./index-cad64f5e.js").then((i=>i.C))),["assets/index-cad64f5e.js","assets/index-be6ca56e.css"]))),C={Background:n.div`
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
    background-color: ${e.WHITE};
    border-radius: 5px;
    bottom: 20px;
    color: ${e.BLACK};
    padding: ${d.XS};
    position: fixed;
    right: 20px;
    width: max-content;

    > h2 {
      margin-bottom: ${d.XXXS};
    }

    > button {
      all: unset;
      background-color: ${e.BLACK};
      border-radius: 3px;
      color: ${e.WHITE};
      cursor: pointer;
      font-size: 12px;
      padding: ${d.XXXXS};

      &:focus-visible {
        outline: auto;
      }
    }
  `};function k(){const i=l((i=>i.currentTimerName)),n=c((i=>i.openedModal)),o=u((i=>i.config.theme)),[a,s]=r.useState(!0);return t(h,{theme:{bg:o.colorThemes[i],text:e.WHITE},children:m(C.Background,{children:[m(C.Container,{children:[t(p,{}),m("main",{children:[t(f,{}),"settings"===n?t(g,{children:t(r.Suspense,{fallback:t($,{}),children:t(X,{})})}):null,"colors"===n?t(g,{children:t(r.Suspense,{fallback:t($,{}),children:t(_,{})})}):null]})]}),"Notification"in window&&"default"===Notification.permission&&a?m(C.PermissionContainer,{role:"dialog","aria-labelledby":"notification-dialog-label",children:[t("h2",{id:"notification-dialog-label",children:"Allow Notification?"}),t("button",{type:"button",onClick:()=>{Notification.requestPermission(),s(!1)},children:"Open notification menu"})]}):null]})})}export{k as default};
