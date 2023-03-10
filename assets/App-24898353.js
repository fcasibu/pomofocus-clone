import{s as a,a as i,u as o,j as e,F as s,O as t,c,b as d,H as m,T as h}from"./index-d625068e.js";const n={Background:a.div`
    background-color: ${({theme:r})=>r.bg};
    height: 100%;
    transition: background-color 0.5s;

    @media (prefers-reduced-motion) {
      transition: none;
    }
  `,Container:a.div`
    height: 100%;
    margin: 0 auto;
    max-width: 640px;
    padding: 14px ${i.XXXS};
  `};function g(){const{currentTimerName:r}=o();return e(s,{theme:{bg:t.theme.colorThemes[r],text:c.WHITE},children:e(n.Background,{children:d(n.Container,{children:[e(m,{}),e("main",{children:e(h,{})})]})})})}export{g as default};
