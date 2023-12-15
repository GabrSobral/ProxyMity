<script>
    import "../app.css";

	import { setAppThemeContext } from "../contexts/theme/context";

    import '@fontsource-variable/inter';

    setAppThemeContext();
</script>

<style>
    :global(body) {
        font-family: 'Inter', sans-serif;
    }
</style>

<slot /> 

