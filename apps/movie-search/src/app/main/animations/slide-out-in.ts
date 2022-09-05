import {animate, group, keyframes, style, transition, trigger} from "@angular/animations";

export const slideOutIn = [trigger("showHide", [
  transition(":leave", [
    animate(300, style({opacity: 0.6})),
    group([
      animate(200, style({transform: 'translateY(100px) scale(0.2)'}))
    ])
  ]),
  transition(":enter", [
    style({opacity: 0}),
    animate(500, keyframes([
      style({opacity: 0.6, transform: "translateY(100px)", offset: 0}),
      style({transform: "scale(0.9)", offset: 0.1}),
      style({transform: "scale(0.8)", offset: 0.2}),
      style({transform: "scale(1.1)", offset: 0.45}),
      style({transform: "*", opacity: 1, offset: 1})
    ]))])
])];
