export const portal = (node: HTMLElement) => {
	document.getElementById('portal-target')?.appendChild(node).focus();
};
