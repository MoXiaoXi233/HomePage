<?php
$title = "项目";
include 'includes/header.php';
?>

<main class="content">
    <div class="card-container-wrapper">
        <div class="swiper-container" id="card-container">
            <div class="swiper-wrapper">
                <a href="https://github.com/MoXiaoXi233/PureSuck-theme" target="_blank" class="swiper-slide card">
                    <div class="card-title">PureSuck Theme</div>
                    <div class="card-description">一个简约雅观的 Typecho 主题</div>
                </a>
                <a href="https://github.com/MoXiaoXi233/HomePage" target="_blank" class="swiper-slide card">
                    <div class="card-title">HomePage</div>
                    <div class="card-description">个人自用的个人引导页</div>
                </a>
                <a href="#" target="_blank" class="swiper-slide card">
                    <div class="card-title">占位符</div>
                    <div class="card-description">只是为了展示这个地方可以拖动</div>
                </a>
                <a href="#" target="_blank" class="swiper-slide card">
                    <div class="card-title">占位符</div>
                    <div class="card-description">只是为了展示这个地方可以拖动</div>
                </a>
                <a href="#" target="_blank" class="swiper-slide card">
                    <div class="card-title">占位符</div>
                    <div class="card-description">只是为了展示这个地方可以拖动</div>
                </a>
            </div>
        </div>
    </div>
    <p>这有一些我开发的小玩意，希望你能喜欢，可以的话还请给我个Star☆</p>
</main>

<script src="js/swiper-bundle.min.js"></script>
<script>
    var swiper = new Swiper('#card-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        grabCursor: true,
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
        }
    });
</script>

<?php include 'includes/footer.php'; ?>
