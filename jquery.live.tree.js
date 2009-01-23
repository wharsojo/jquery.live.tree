/*
 * jquery.live.tree 1.0.0 - jQuery plugin to hide and show branches of a tree
 *
 * http://wharsojo.wordpress.com/jquery-plugin-live-tree/
 * http://docs.jquery.com/Plugins/liveTree
 *
 * Copyright (c) 2009 
 *   Widi Harsojo (http://wharsojo.wordpress.com)
 *
 * Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
 * and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 *
 * $Date: 2009-01-23 $
 * 
 * NOTE: css based on Jörn Zaefferer jquery.treeview.js
 */
jQuery.liveTree = function(){
  jQuery.liveTree.click = {};
  $('ul.livetree').liveTree(true);
  //helper for loading from ajax
  function get_tree(url){ 
    var ul = this.node.children('ul:eq(0)');
    $.get(url,function(data){ul.html(data).liveTree();});
    return true;
  }
  //css key use by togle_tree
  var tl = ({none :['expandable' ,[' lastExpandable' ,''],[' lastExpandable-hitarea' ,'']]
            ,block:['collapsable',[' lastCollapsable',''],[' lastCollapsable-hitarea','']]});
  //helper for basic togle_tree
  function togle_tree(){ 
    var li = this.node;
    var sb = li.next().length;
    var ul = li.children('ul:eq(0)');
    var hh = li.children('.hitarea:eq(0)');
    var tg = ul.css('display')=='none'?'block':'none';
    hh.removeClass('expandable-hitarea collapsable-hitarea lastExpandable-hitarea lastCollapsable-hitarea');
    li.removeClass('expandable collapsable lastExpandable lastCollapsable');
    hh.addClass('hitarea '+tl[tg][0]+'-hitarea'+tl[tg][2][sb]);
    li.addClass(           tl[tg][0]+           tl[tg][1][sb]);
    ul.css('display',tg);
  }
  //registering global event for togling tree
  function reset_togle_tree(){
    $.liveTree.click['togleTree'] = togle_tree;
  }
  reset_togle_tree();
  //event queue executor 
  function do_events(li,clk){ 
    var ok = true;
    $.each(clk,function(){
      var lv= li.parent().attr('live')+':'+this;
      if(ok && typeof $.liveTree.click[lv]=='function')
         ok = ({event:$.liveTree.click[lv],node:li,resetTogleTree:reset_togle_tree,getTree:get_tree}).event();
    });
    return ok;
  }
  //event id generator
  function clicked(ths,cls){ 
    var li  = $(ths).parent();
    var grp = ''+li.attr('all');
    var clk = ths.id=='' ? [cls,'tree']:
                           ['id:'+ths.id,cls,'tree'];
    if( grp!='undefined')
        clk = clk.concat(grp.replace(/(\w+)/g,"grp:$1").trim().split(/\s+/));
    do_events(li,clk.concat('tree'));
  };
  // registering liveTree node clicked
  $('.livetree span.folder').live('click',function(){ clicked(this,'folder'); });
  $('.livetree span.file'  ).live('click',function(){ clicked(this,'file');   });
  //**************************************************
  // registering liveTree mouse clicked on hitarea ***
  $('.livetree .hitarea').live('click',function(){
    var li = $(this).parent();
    var ul = li.children('ul:eq(0)');
    var ht = do_events(li,['hit']);
    var tg = ul.css('display')=='none'?'block':'none';
    if (ht && tg=='block' && ul.children('li').length==0)
        ht = do_events(li,['hit:empty']); //event hit:empty folder
    if (ht) //event hit:open/hit:close folder
        ht = do_events(li,[({block:'hit:open',none:'hit:close'})[tg]]); 
    if (ht) //global event for togling tree
        ({event:$.liveTree.click['togleTree'],node:li,getTree:get_tree}).event();
  });
};
//****************************************************************
// liveTree Constructor for initial/loading from ajax get_tree ***
jQuery.fn.liveTree = function(init){
  var tl = ({sp:['file','folder']
            ,ht:[' lastExpandable-hitarea','']
            ,li:[['',' last',''],['expandable',' lastExpandable','']] })
  this.each(function(){
    var xx = $(this);
    var lv = ''+xx.attr('live');
    if(init!=undefined)xx.addClass('treeview');
    xx.find('ul').css('display','none').attr('live',lv);
    xx.find('li').each(function(){
      var li = $(this);
      var sb = li.next().length;
      var ch = li.children('ul').size();
      if (ch!=0)
      li.prepend('<div class="hitarea expandable-hitarea'+tl.ht[sb]+'"/>');
      li.addClass( tl.li[ch][0] + tl.li[ch][sb+1] )
        .children('span:eq(0)').addClass(tl.sp[ch]);
    });
  });
};
//*****************************REGISTERING!!!***  
$(function(){ $.liveTree(); });
