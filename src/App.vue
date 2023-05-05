<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
		//background: -webkit-linear-gradient(45.6deg, #f759a3 -73.70%, #f9d8ab 26.30%, #95ed3e 126.30%, #eb14c2 226.30%);
		///* Safari 5.1 - 6.0 */
		//background: -o-linear-gradient(45.6deg, #f759a3 -73.70%, #f9d8ab 26.30%, #95ed3e 126.30%, #eb14c2 226.30%);
		///* Opera 11.1 - 12.0 */
		//background: -moz-linear-gradient(45.6deg, #f759a3 -73.70%, #f9d8ab 26.30%, #95ed3e 126.30%, #eb14c2 226.30%);
		///* Firefox 3.6 - 15 */
		//background: linear-gradient(45.6deg, #f759a3 -73.70%, #f9d8ab 26.30%, #95ed3e 126.30%, #eb14c2 226.30%);

}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>