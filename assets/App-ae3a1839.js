import{r as e,_ as i,s as n,a as t,c as o,u as a,b as s,d as r,T as l,K as d,e as c,f as m,g as u,h as p,j as h,F as g,i as b,H as f,k as _,M as k,S as x,P as S,l as y}from"./index-2b7396da.js";const P=e.lazy((()=>i((()=>import("./index-2b7396da.js").then((e=>e.z))),["assets/index-2b7396da.js","assets/index-4732b074.css"]))),I=e.lazy((()=>i((()=>import("./index-2b7396da.js").then((e=>e.C))),["assets/index-2b7396da.js","assets/index-4732b074.css"]))),T=e.lazy((()=>i((()=>import("./index-2b7396da.js").then((e=>e.A))),["assets/index-2b7396da.js","assets/index-4732b074.css"]))),E=e.lazy((()=>i((()=>import("./index-2b7396da.js").then((e=>e.B))),["assets/index-2b7396da.js","assets/index-4732b074.css"]))),N=e.lazy((()=>i((()=>import("./index-2b7396da.js").then((e=>e.D))),["assets/index-2b7396da.js","assets/index-4732b074.css"]))),w={Background:n.div.withConfig({displayName:"App__Background",componentId:"sc-1ihkw0j-0"})(["background-color:",";min-height:100%;padding-right:",";transition:background-color 0.5s;@media (prefers-reduced-motion){transition:none;}"],(({theme:e})=>e.bg),(({$shouldPad:e})=>e&&"17px")),Container:n.div.withConfig({displayName:"App__Container",componentId:"sc-1ihkw0j-1"})(["margin:0 auto;max-width:640px;padding:14px ",";> main{padding-bottom:",";}"],t.XXXS,t.XL),PermissionContainer:n.div.withConfig({displayName:"App__PermissionContainer",componentId:"sc-1ihkw0j-2"})(["background-color:",";border-radius:5px;bottom:20px;color:",";padding:",";position:fixed;right:20px;width:max-content;> h2{margin-bottom:",";}> button{all:unset;background-color:",";border-radius:3px;color:",";cursor:pointer;font-size:12px;padding:",";&:focus-visible{outline:auto;}}"],o.WHITE,o.BLACK,t.XS,t.XXXS,o.BLACK,o.WHITE,t.XXXXS)};function C(){const i=a((e=>e.currentTimerName)),n=s((e=>e.openedModal)),t=r((e=>e.config.theme)),[C,A]=e.useState(!0);e.useEffect((()=>{const e=a.subscribe((({seconds:e,currentTimerName:i,done:n,isPaused:t,isPlaying:o})=>{localStorage.setItem(l,JSON.stringify({seconds:e,currentTimerName:i,done:n,isPaused:t,isPlaying:o}))})),i=r.subscribe((({config:e})=>{localStorage.setItem(d,JSON.stringify(e))})),n=c.subscribe((({tasks:e,selectedTask:i})=>{localStorage.setItem(m,JSON.stringify({tasks:e,selectedTask:i}))})),t=u.subscribe((({templates:e})=>{localStorage.setItem(p,JSON.stringify({templates:e}))}));return()=>{e(),i(),n(),t()}}),[]);const X="document"in window&&document.body.scrollHeight>document.body.clientHeight;return h(g,{theme:{bg:t.colorThemes[i],text:o.WHITE},children:b(w.Background,{$shouldPad:"closed"!==n&&X,children:[b(w.Container,{children:[h(f,{}),b("main",{children:[h(_,{}),"settings"===n?h(k,{children:h(e.Suspense,{fallback:h(x,{}),children:h(P,{})})}):null,"colors"===n?h(k,{children:h(e.Suspense,{fallback:h(x,{}),children:h(I,{})})}):null,"template-save"===n&&h(k,{children:h(e.Suspense,{fallback:h(x,{}),children:h(T,{})})}),"template-save-to"===n&&h(k,{children:h(e.Suspense,{fallback:h(x,{}),children:h(E,{})})}),"template-list"===n&&h(k,{children:h(e.Suspense,{fallback:h(x,{}),children:h(N,{})})}),h(S,{}),h(y,{})]})]}),"Notification"in window&&"default"===Notification.permission&&C?b(w.PermissionContainer,{role:"dialog","aria-labelledby":"notification-dialog-label",children:[h("h2",{id:"notification-dialog-label",children:"Allow Notification?"}),h("button",{type:"button",onClick:()=>{Notification.requestPermission(),A(!1)},children:"Open notification menu"})]}):null]})})}export{C as default};
