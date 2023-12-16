function renderToPNG(id) {
    var element = document.getElementById(id);
    return html2canvas(element, {
        scale: 2.5
    }).then(function (canvas) {
        var imgData = canvas.toDataURL('image/png');
        return imgData;
    });
}


function generate() {
    var name = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(2) > input").value;
    var sex = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(6) > input").value;
    var age = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(7) > input").value;
    var dateOfBirth = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(8) > input").value;
    var sfz = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(4) > input").value;
    var address = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(9) > input").value;

    document.querySelector("#name").innerHTML = name;
    document.querySelector("#sex").innerHTML = sex;
    document.querySelector("#age").innerHTML = age;
    document.querySelector("#dateOfBirth").innerHTML = dateOfBirth;
    document.querySelector("#sfz").innerHTML = sfz;
    document.querySelector("#address").innerHTML = address;

    renderToPNG('renderResources').then(function (pngData) {
        document.getElementById('res').src = pngData;
    });
}


document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(3) > input").addEventListener("change", function () {
    if (document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(3) > input").value !== '') {
        var img = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(3) > input").files[0];

        const reader = new FileReader();
        reader.onload = function () {
            const base64String = reader.result;
            document.querySelector("#img").src = base64String;
        };
        reader.readAsDataURL(img);

    } else {
        document.querySelector("#img").src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+A8AAQABAIg4cUQAAAAASUVORK5CYII=';
    }
});


function d_img() {
    var pngData = document.querySelector("#res").src;


    var currentTime = new Date().toLocaleTimeString(); // 获取当前时间的字符串表示
    var result = currentTime.replace(/:/g, "");
    var filename = document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(2) > input").value + result;
    downloadBlob(pngData, filename + '.png');
}

function downloadBlob(data, filename) {
    var byteCharacters = atob(data.split(',')[1]);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: 'image/png' });

    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function parseIdCard() {
    var idCard = document.querySelector("body > div.mdui-container.mdui-typo > div.mdui-textfield.mdui-textfield-floating-label.mdui-textfield-has-bottom > input").value;
    fetch('https://zj.v.api.aa1.cn/api/sfz/?sfz=' + idCard)
        .then(function (response) {
            if (response.ok) {
                return response.json(); // 将响应体解析为 JSON
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(function (data) {
            // 在这里处理获取到的数据
            console.log(data);

            if (data.code == 200) {
                var sex = data.data.xb;
                var age = data.data.age + '岁';
                var address = data.data.province + data.data.city;
                // 获取生日
                //解析身份证
                var birthDateStr = idCard.substr(6, 8);
                var year = birthDateStr.substring(0, 4);
                var month = birthDateStr.substring(4, 6);
                var day = birthDateStr.substring(6, 8);

                // 添加前导零
                if (parseInt(month) < 10) {
                    month = '0' + parseInt(month);
                }
                if (parseInt(day) < 10) {
                    day = '0' + parseInt(day);
                }

                var birthDate = year + '年' + month + '月' + day + '日';

                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(6) > input").value = sex;
                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(6)").classList.add('mdui-textfield-not-empty');

                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(7) > input").value = age;
                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(7)").classList.add('mdui-textfield-not-empty');

                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(8) > input").value = birthDate;
                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(8)").classList.add('mdui-textfield-not-empty');


                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(9) > input").value = address;
                document.querySelector("body > div.mdui-container.mdui-typo > div:nth-child(9)").classList.add('mdui-textfield-not-empty');

            }

        })
        .catch(function (error) {
            // 捕获请求过程中的错误
            console.error('Fetch error:', error);
        });

}


function watermark(str) {
    var a = `<a>` + str + `</a>`;
    for (var i = 0; i < 4; i++) {
        a += a;
    }
    var div = `<div>`+ a + `</div>`
    for (var i = 0; i < 4; i++) {
        div += div;
    }
    document.querySelector("#watermark").innerHTML = div;
    console.log(div);
}