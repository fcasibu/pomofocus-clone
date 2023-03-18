import{U as n,s as e,j as a,F as t,r as i,_ as r,a as o,u as s,b as d,c,d as l,e as h,f as m,H as u,T as g,M as f}from"./index-9ccce576.js";const p=n`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`,b={Container:e.div`
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);

    > div {
      animation: ${p} 1s infinite;
    }
  `};function x(){return a(b.Container,{children:a("div",{children:a(t,{size:50})})})}const _=i.lazy((()=>r((()=>import("./index-9ccce576.js").then((n=>n.S))),["assets/index-9ccce576.js","assets/index-be6ca56e.css"]))),k={Background:e.div`
    background-color: ${({theme:n})=>n.bg};
    height: 100%;
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,Container:e.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${o.XXXS};
  `};function v(){const n=s((n=>n.currentTimerName)),e=d((n=>n.openedModal)),t=c((n=>n.config.theme));return a(l,{theme:{bg:t.colorThemes[n],text:h.WHITE},children:a(k.Background,{children:m(k.Container,{children:[a(u,{}),m("main",{children:[a(g,{}),"settings"===e?a(f,{children:a(i.Suspense,{fallback:a(x,{}),children:a(_,{})})}):null]})]})})})}export{v as default};
