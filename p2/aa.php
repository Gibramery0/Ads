<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Little Candy Bakery - Oyun</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #ffeef2;
        }
        /* Header Styles */
        .header {
            background-color: #fff;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            position: relative;
            z-index: 1000;
        }
        .menu-icon {
            position: absolute;
            left: 20px;
            font-size: 24px;
            cursor: pointer;
            color: #ff6b9d;
        }
        .search-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 0 40px;
        }
        .search-bar {
            width: 100%;
            padding: 10px 15px;
            border: 2px solid #ff6b9d;
            border-radius: 25px;
            outline: none;
            font-size: 16px;
        }
        .search-bar:focus {
            box-shadow: 0 0 5px rgba(255,107,157,0.3);
        }
        /* Sidebar Styles */
        .sidebar {
            position: fixed;
            left: -60px;
            top: 64px;
            width: 60px;
            height: calc(100% - 64px);
            background-color: #fff;
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            z-index: 999;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        .sidebar.active {
            left: 0;
        }
        .sidebar:hover {
            width: 200px;
        }
        .sidebar-item {
            padding: 15px;
            display: flex;
            align-items: center;
            color: #666;
            text-decoration: none;
            transition: background-color 0.2s;
            white-space: nowrap;
        }
        .sidebar-item:hover {
            background-color: #fff5f7;
            color: #ff6b9d;
        }
        .sidebar-item i {
            font-size: 24px;
            min-width: 30px;
        }
        .sidebar-item span {
            margin-left: 10px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .sidebar:hover .sidebar-item span {
            opacity: 1;
        }
        /* Main Content */
        .container {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: flex-start;
            padding: 20px;
            transition: padding-left 0.3s ease;
            flex-wrap: wrap;
            gap: 20px;
        }
        .container.sidebar-active {
            padding-left: 80px;
        }
        .content {
            flex: 1;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            text-align: center;
            min-width: 300px;
            max-width: 1200px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            order: 2;
        }
        .game-container {
            width: 100%;
            max-width: 100%;
            position: relative;
            padding-top: 75%;
        }
        .game-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .ad {
            width: 300px;
            padding: 10px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f0f0;
            font-size: 18px;
            color: #666;
        }
        .ad-left, .ad-right {
            height: 600px;
            min-height: 600px;
        }
        .ad-left {
            order: 1;
        }
        .ad-right {
            order: 3;
        }
        .ad-bottom {
            width: 100%;
            height: 90px;
            margin: 20px 0;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            color: #666;
        }
        .game-info {
            margin-top: 30px;
            padding: 20px;
            background-color: #fff5f7;
            border-radius: 10px;
            text-align: left;
            width: 100%;
        }
        .game-info h2 {
            color: #ff6b9d;
            margin-bottom: 15px;
        }
        .game-info p {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.6;
        }

        /* Mobile Styles */
        @media (max-width: 1200px) {
            .ad-left, .ad-right {
                height: 600px;
                min-height: 600px;
            }
        }

        @media (max-width: 768px) {
            .search-container {
                padding: 0 50px;
            }
            .container {
                padding: 10px;
                flex-direction: column;
                align-items: center;
            }
            .container.sidebar-active {
                padding-left: 70px;
            }
            .content {
                order: 1;
                margin: 0;
                width: 100%;
            }
            .ad {
                width: 100%;
                max-width: 400px;
                height: 250px;
                min-height: 250px;
            }
            .ad-left, .ad-right {
                height: 250px;
                min-height: 250px;
            }
            .game-container {
                padding-top: 100%; /* Mobilde daha kare görünüm */
            }
        }

        @media (max-width: 480px) {
            .header {
                padding: 10px;
            }
            .menu-icon {
                left: 10px;
            }
            .search-container {
                padding: 0 40px;
            }
            .search-bar {
                font-size: 14px;
                padding: 8px 12px;
            }
            .container {
                padding: 5px;
            }
            .content {
                padding: 10px;
            }
            .game-info {
                padding: 15px;
            }
            .game-info h2 {
                font-size: 18px;
            }
            .game-info p {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <i class="fas fa-bars menu-icon" id="menuIcon"></i>
        <div class="search-container">
            <input type="text" class="search-bar" placeholder="Oyun ara...">
        </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <a href="#" class="sidebar-item">
            <i class="fas fa-gamepad"></i>
            <span>Tüm Oyunlar</span>
        </a>
        <a href="#" class="sidebar-item">
            <i class="fas fa-puzzle-piece"></i>
            <span>Bulmaca</span>
        </a>
        <a href="#" class="sidebar-item">
            <i class="fas fa-star"></i>
            <span>Popüler</span>
        </a>
        <a href="#" class="sidebar-item">
            <i class="fas fa-heart"></i>
            <span>Favoriler</span>
        </a>
    </div>

    <div class="container">
        <div class="ad ad-left">
            Ads Field
        </div>

        <div class="content">
            <div class="game-container">
                <iframe 
                    src="https://html5.gamedistribution.com/8ae87b2c4ede4a9e8a56d9df8ed17052/?gd_sdk_referrer_url=https://<?php echo $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?>" 
                    scrolling="none" 
                    frameborder="0">
                </iframe>
            </div>

            <div class="ad-bottom">
                Ads Field
            </div>

            <div class="game-info">
                <h2>Little Candy Bakery</h2>
                <p>Little candy bakery is a puzzle match 3 game, bake the candy and match candies together to win. The game theme is calm and entertaining.</p>
                <h3>Nasıl Oynanır:</h3>
                <p>Öğeleri hareket ettirmek için farenizin sol tuşunu kullanın (yukarı, aşağı, sağa, sola).</p>
            </div>
        </div>

        <div class="ad ad-right">
            Ads Field
        </div>
    </div>

    <script>
        const menuIcon = document.getElementById('menuIcon');
        const sidebar = document.getElementById('sidebar');
        const container = document.querySelector('.container');

        menuIcon.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            container.classList.toggle('sidebar-active');
        });

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuIcon.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                container.classList.remove('sidebar-active');
            }
        });
    </script>
</body>
</html> 