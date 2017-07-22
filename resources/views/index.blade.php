<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
	<meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
	<title></title>
	<script>
    window.Laravel = {!! json_encode([
        'csrfToken' => csrf_token(),
    ]) !!};
    </script>
</head>
<style>
	html, body, #app {
		width: 100%;
		height: 100%;
	}
	body {
		background: url("images/background.jpg") repeat center 0;
		background-size: auto;
		font-family: monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
	}
</style>
<body>
	<div id="app">
		<login />
	</div>
	<script src="js/app.js"></script>
</body>
</html>