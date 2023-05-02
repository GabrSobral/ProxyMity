export interface LoadingSpinningProps {
	size?: number;
	color?: string;
	lineSize?: number;
}

export function LoadingSpinning({ size = 56, color = '#F12646', lineSize = 9 }: LoadingSpinningProps) {
	return (
		<div
			className="animate-spin"
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				background: `radial-gradient(farthest-side, ${color} 94%,#0000) top/${lineSize}px ${lineSize}px no-repeat, conic-gradient(#0000 30%, ${color})`,
				WebkitMask: `radial-gradient(farthest-side,#0000 calc(100% - ${lineSize}px),#000 0)`,
			}}
		/>
	);
}
