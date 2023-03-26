import{r as i,_ as o,s as n,a as e,c as t,u as a,b as r,d as s,T as l,K as c,j as d,F as u,e as g,H as h,f as m,M as b,S as f,P as p}from"./index-c9b53246.js";const x=i.lazy((()=>o((()=>import("./index-c9b53246.js").then((i=>i.g))),["assets/index-c9b53246.js","assets/index-be6ca56e.css"]))),S=i.lazy((()=>o((()=>import("./index-c9b53246.js").then((i=>i.C))),["assets/index-c9b53246.js","assets/index-be6ca56e.css"]))),X={Background:n.div`
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
    padding: 14px ${e.XXXS};
  `,PermissionContainer:n.div`
    background-color: ${t.WHITE};
    border-radius: 5px;
    bottom: 20px;
    color: ${t.BLACK};
    padding: ${e.XS};
    position: fixed;
    right: 20px;
    width: max-content;

    > h2 {
      margin-bottom: ${e.XXXS};
    }

    > button {
      all: unset;
      background-color: ${t.BLACK};
      border-radius: 3px;
      color: ${t.WHITE};
      cursor: pointer;
      font-size: 12px;
      padding: ${e.XXXXS};

      &:focus-visible {
        outline: auto;
      }
    }
  `};function _(){const o=a((i=>i.currentTimerName)),n=r((i=>i.openedModal)),e=s((i=>i.config.theme)),[_,k]=i.useState(!0);return i.useEffect((()=>{const i=a.subscribe((i=>{localStorage.setItem(l,JSON.stringify(i))})),o=s.subscribe((i=>{localStorage.setItem(c,JSON.stringify(i.config))}));return()=>{i(),o()}}),[]),d(u,{theme:{bg:e.colorThemes[o],text:t.WHITE},children:g(X.Background,{children:[g(X.Container,{children:[d(h,{}),g("main",{children:[d(m,{}),"settings"===n?d(b,{children:d(i.Suspense,{fallback:d(f,{}),children:d(x,{})})}):null,"colors"===n?d(b,{children:d(i.Suspense,{fallback:d(f,{}),children:d(S,{})})}):null,d(p,{})]})]}),"Notification"in window&&"default"===Notification.permission&&_?g(X.PermissionContainer,{role:"dialog","aria-labelledby":"notification-dialog-label",children:[d("h2",{id:"notification-dialog-label",children:"Allow Notification?"}),d("button",{type:"button",onClick:()=>{Notification.requestPermission(),k(!1)},children:"Open notification menu"})]}):null]})})}export{_ as default};
