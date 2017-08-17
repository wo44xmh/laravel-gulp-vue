<!DOCTYPE html>
<html>
<head>
    <title>后台</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
<div id="app">
</div>
<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
