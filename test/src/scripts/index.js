import $ from 'jquery'
import '../index.less'
$.get('/abc.json').done(res=> {
  $('.demo-1').html(JSON.stringify(res));
});
$.get('/demo_delay.json').done(res=> {
  $('.demo-2').html(JSON.stringify(res));
});