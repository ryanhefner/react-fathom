import '@testing-library/jest-dom'

// jsdom intentionally leaves layout-driven scrolling unimplemented. Provide a
// no-op browser-compatible boundary so router tests can focus on tracking.
window.scrollTo = () => {}
