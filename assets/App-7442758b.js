import{s as a,a as t,u as d,b as c,c as l,j as e,F as u,d as g,e as s,H as m,T as h,M as p,S as x}from"./index-01adcf01.js";const o={Background:a.div`
    background-color: ${({theme:n})=>n.bg};
    height: 100%;
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,Container:a.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${t.XXXS};
  `};function b(){const{currentTimerName:n}=d(),{openedModal:r}=c(),{theme:i}=l();return e(u,{theme:{bg:i.colorThemes[n],text:g.WHITE},children:e(o.Background,{children:s(o.Container,{children:[e(m,{}),s("main",{children:[e(h,{}),r==="settings"?e(p,{children:e(x,{})}):null]})]})})})}export{b as default};
