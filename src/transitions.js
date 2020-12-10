export default ({ duration }) => ({
  "fade-default": {
    transition: `opacity ${duration}ms ease-in`,
    opacity: 0,
  },

  "fade-entering": {
    opacity: 0,
  },

  "fade-entered": {
    opacity: 1,
  },

  "fade-exiting": {
    opacity: 0,
  },

  "fade-exited": {
    opacity: 0,
  },

  "zoom-default": {
    transition: `transform ${duration}ms ease-in`,
    transform: "scale(0)",
    opacity: 0,
  },

  "zoom-entering": {
    transform: "scale(0)",
    opacity: 0,
  },

  "zoom-entered": {
    transform: "scale(1)",
    opacity: 1,
  },

  "zoom-exiting": {
    transform: "scale(0)",
    opacity: 1,
  },

  "zoom-exited": {
    transform: "scale(0)",
    opacity: 0,
  },

  "squeeze-default": {
    transition: `transform ${duration}ms ease-in`,
    transform: "rotateY(90deg)",
    opacity: 0,
  },

  "squeeze-entering": {
    transform: "rotateY(90deg)",
    opacity: 0,
  },

  "squeeze-entered": {
    transform: "rotateY(0deg)",
    opacity: 1,
  },

  "squeeze-exiting": {
    transform: "rotateY(90deg)",
    opacity: 1,
  },

  "squeeze-exited": {
    transform: "rotateY(90deg)",
    opacity: 0,
  },
});
