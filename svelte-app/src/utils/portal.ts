export const appendToPortal = (node: HTMLElement) => {
   document.getElementById('portal-target')?.appendChild(node).focus();
};
