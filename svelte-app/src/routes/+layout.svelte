<script>
	import '../app.css';

	import { setAppThemeContext } from '../contexts/theme/context';

	import '@fontsource-variable/inter';

	setAppThemeContext();
</script>

<slot />

<style>
	:global(body) {
		font-family: 'Inter Variable', sans-serif;
	}
</style>
