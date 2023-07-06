document.getElementById("start-button").addEventListener("click", function() {
    // Get the selected image file
    var fileInput = document.getElementById("file-input");
    var file = fileInput.files[0];

    // Get the value of k
    var kInput = document.getElementById("k-input");
    var k = parseInt(kInput.value);
    console.log("k is",k)
    // Display the selected image in the preview container
    var previewImage = document.getElementById("preview-image");
    var reader = new FileReader();

    reader.onload = function(e) {
      previewImage.src = e.target.result;
      
      var img = new Image();
      img.src = e.target.result;
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);

        // Get the pixel data
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        clusters = kMeansClustering(pixels,k);
        console.log(clusters);
        pie_option = getpiechart(clusters);
        bar_option = getbarchart(clusters);
        console.log(pie_option)
        var chartdom1 = document.getElementById('result-image1')
        var chartdom2 = document.getElementById('result-image2')

        myChart1 = echarts.init(chartdom1)
        myChart2 = echarts.init(chartdom2)

        pie_option && myChart1.setOption(pie_option);
        bar_option && myChart2.setOption(bar_option);
        console.log("it succeeded")
        
      };
    }
    reader.readAsDataURL(file);

function getpiechart(data){
    generated_data = new Array()
    for (i=0;i<k;i++){
        generated_data.push({value:data[i].pixels.length,name:'cluster '+(i+1).toString()})
    }
    color = new Array()
    for (i=0;i<k;i++){
        color.push('rgba('+data[i].centroid.toString()+")")
    }
    console.log(color)
    option = {
        title: {
          text: 'color show',
          subtext: 'count by pixels',
          left: 'center'
        },
        color:color,
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'color',
            type: 'pie',
            radius: '50%',
            data: generated_data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      return option;
};

function getbarchart(data){
    colors = new Array()
    for (i=0;i<k;i++){
        colors.push('rgba('+data[i].centroid.toString()+")")
    }
    generated_data = new Array()
    for (i=0;i<k;i++){
        generated_data.push({value:data[i].pixels.length,name:'cluster '+(i+1).toString(),itemStyle:{color:colors[i]}})
    }
    console.log(color)
    cata = new Array()
    for (i = 0; i< k; i++){
      cata.push('cluster'+(i+1).toString())
    }
    option = {
      xAxis: {
        type: 'category',
        data: cata
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data:generated_data,
          type: 'bar'
        }
      ]
      };
      return option;
}


    //define the K means clustering 
    //you should provide the pixels array and an int k
    function kMeansClustering(pixels, k) {
        clusters = initializeClusters(pixels, k);
        var iterations = 20;
  
        for (var i = 0; i < iterations; i++) {
          assignPixelsToClusters(pixels, clusters);
          updateClusterCentroids(pixels, clusters);
          console.log('one iteration')
        }
  
        return clusters;//clusters are array[{centroid:[RBGA],pixels:[index1,index2……]}]
      }
  
      function initializeClusters(pixels, k) {
        var clusters = [];
  
        for (var i = 0; i < k; i++) {
          var randomIndex = Math.floor(Math.random() * pixels.length / 4);
          var centroid = [
            pixels[randomIndex * 4],
            pixels[randomIndex * 4 + 1],
            pixels[randomIndex * 4 + 2],
            pixels[randomIndex * 4 + 3]
          ];
  
          clusters.push({
            centroid: centroid,
            pixels: []
          });
        }
  
        return clusters;
      }
  
      function assignPixelsToClusters(pixels, clusters) {
        for (var i = 0; i < clusters.length; i++) {
          clusters[i].pixels = [];
        }
  
        for (var j = 0; j < pixels.length / 4; j++) {
          var pixel = [
            pixels[j * 4],
            pixels[j * 4 + 1],
            pixels[j * 4 + 2],
            pixels[j * 4 + 3]
          ];
  
          var minDistance = Number.MAX_VALUE;
          var clusterIndex = 0;
  
          for (var k = 0; k < clusters.length; k++) {
            var distance = calculateDistance(pixel, clusters[k].centroid);
  
            if (distance < minDistance) {
              minDistance = distance;
              clusterIndex = k;
            }
          }
  
          clusters[clusterIndex].pixels.push(j);
        }
      }
  
      function updateClusterCentroids(pixels, clusters) {
        for (var i = 0; i < clusters.length; i++) {
          var sum = [0, 0, 0, 0];
  
          for (var j = 0; j < clusters[i].pixels.length; j++) {
            var pixelIndex = clusters[i].pixels[j];
  
            for (var k = 0; k < 4; k++) {
              sum[k] += pixels[pixelIndex * 4 + k];
            }
          }
  
          var centroid = clusters[i].centroid;
          var numPixels = clusters[i].pixels.length;
  
          for (var k = 0; k < 4; k++) {
            centroid[k] = Math.round(sum[k] / numPixels);
          }
        }
      }
  
      function calculateDistance(pixel1, pixel2) {
        var sum = 0;
  
        for (var i = 0; i < 4; i++) {
          sum += Math.pow(pixel1[i] - pixel2[i], 2);
        }
  
        return Math.sqrt(sum);
      }
  

})
