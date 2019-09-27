export default ({ duration }) => ({
  "fade-default": {
    transition: `opacity ${duration}ms ease-in`,
    opacity: 0
  },

  "fade-entering": {
    opacity: 0
  },

  "fade-entered": {
    opacity: 1
  },

  "fade-exiting": {
    opacity: 0
  },

  "fade-exited": {
    opacity: 0
  }
});
