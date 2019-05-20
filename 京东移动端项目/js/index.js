window.onload = function () {
    searchEffect();
    timeBack();
    bannerEffect();
    bannerTouchEffect();
};
var banner_wrap, first_item, last_item, lis, img_length, indicators_items;
var banner_timer = null;
var index = 1;
var start_x, move_offset_x;
var touch_start_time, touch_end_time;

function searchEffect() {
    var $header = $('#jd_header');
    var header_height = $header.height();
    window.onscroll = function () {
        var doc_scroll_top = document.body.scrollTop === 0 ? document.documentElement.scrollTop : document.body.scrollTop;
        var opacity_percent =
            doc_scroll_top === 0 || header_height / doc_scroll_top > 1 ?
                1 : header_height / doc_scroll_top < 0.1 ?
                0 : header_height / doc_scroll_top;
        if (opacity_percent !== 0) {
            $header.show();
        } else if (opacity_percent === 0) {
            $header.hide();
        }
        $header.css({'opacity': opacity_percent});

    };
}

function timeBack() {
    var spans = $('.timer').find('span');
    var totalTime = 60 * 62 + 3;
    var h=0, m=0, s=0;
    h = h < 10 ? ('0' + h).split('') : ('' + h).split('');
    m = m < 10 ? ('0' + m).split('') : ('' + m).split('');
    s = s < 10 ? ('0' + s).split('') : ('' + s).split('');
    var shopping_timer = setInterval(function () {
        totalTime -= 1;
        h = timeHandle(Math.floor(totalTime / 60 / 60));
        m = timeHandle(Math.floor(totalTime / 60 % 60));
        s = timeHandle(totalTime % 60);
        $(spans[0]).text(h[0]);
        $(spans[1]).text(h[1]);
        $(spans[3]).text(m[0]);
        $(spans[4]).text(m[1]);
        $(spans[6]).text(s[0]);
        $(spans[7]).text(s[1]);

        if (totalTime <= 0) {
            clearInterval(shopping_timer);
        }
    }, 1000)
}

function timeHandle(time) {
    return time < 10 ? ('0' + time).split('') : ('' + time).split('');
}

function bannerEffect() {
    banner_wrap = $('.banner_wrap')[0];
    first_item = banner_wrap.querySelector('li:first-of-type');
    last_item = banner_wrap.querySelector('li:last-of-type');


    $(banner_wrap).append(first_item.cloneNode(true));
    $(banner_wrap).prepend(last_item.cloneNode(true));


    lis = $(banner_wrap).children();
    img_length = lis.length;
    indicators_items = $('.indicators').find('li');
    $(banner_wrap).css({'width': img_length * 100 + '%', 'left': '-100%'});

    for (var i = 0; i < lis.length; i++) {
        $(lis[i]).css({'width': 100 / lis.length + '%'});
    }

    banner_timer = setInterval(function () {
        _bannerMove($(banner_wrap), indicators_items, img_length, 1);
    }, 1000);
}

function _getCurrentIndex(i, length) {
    return i < 0 ? length - 1 : i >= length ? 0 : i;
}

function _bannerMove($banner_wrap, indicators_items, img_length, direction) {
    if (!$banner_wrap.hasClass('transition')) {
        $banner_wrap.addClass('transition');
    }

    index = direction === 1 ? index + 1 : index - 1;
    index = _getCurrentIndex(index, img_length);
    $banner_wrap.css('left', -100 * index + '%');


    /*第一跳转到最后*/
    if (index === 0 && direction === -1) {
        index = 8;
        setTimeout(function () {
            $banner_wrap.removeClass('transition');
            $banner_wrap.css('left', -100 * index + '%');
        }, 300);
    }

    /*最后跳转到第一*/
    if (index === 9 && direction === 1) {
        index = 1;
        setTimeout(function () {
            $banner_wrap.removeClass('transition');
            $banner_wrap.css('left', -100 * index + '%');
        }, 300);
    }

    $(indicators_items).removeClass('active');
    $(indicators_items[index - 1]).addClass('active');
}

function bannerTouchEffect() {
    var $banner_wrap = $('.banner_wrap');

    $banner_wrap
        .on('touchstart', function (e) {
            if (banner_timer) {
                clearInterval(banner_timer);
            }

            touch_start_time = new Date().getTime();
            start_x = e.originalEvent.targetTouches[0].clientX;
        })
        .on('touchmove', function (e) {
            move_offset_x = e.originalEvent.targetTouches[0].clientX - start_x;
            $banner_wrap.removeClass('transition').css('left', -1 * index * window.innerWidth + move_offset_x + 'px');
        })
        .on('touchend', function (e) {
            touch_end_time = new Date().getTime();
            if (Math.abs(move_offset_x) > 0.1 * window.innerWidth && touch_end_time - touch_start_time <= 500) {
                if (move_offset_x > 0) {
                    _bannerMove($(banner_wrap), indicators_items, img_length, -1);
                } else if (move_offset_x < 0) {
                    _bannerMove($(banner_wrap), indicators_items, img_length, 1);

                }
            } else if (Math.abs(move_offset_x) > 0.5 * window.innerWidth) {
                if (move_offset_x > 0) {
                    _bannerMove($(banner_wrap), indicators_items, img_length, -1);

                } else if (move_offset_x < 0) {
                    _bannerMove($(banner_wrap), indicators_items, img_length, 1);
                }
            } else {

                $banner_wrap.addClass('transition').css('left', -1 * index * window.innerWidth + 'px');
            }

            banner_timer = setInterval(function () {
                _bannerMove($(banner_wrap), indicators_items, img_length, 1);
            }, 1000);
        });
}
