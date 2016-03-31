// Qgis2threejs Project
project = new Q3D.Project({crs:"EPSG:25832",wgs84Center:{lat:55.6712168922,lon:12.4893929063},proj:"+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",title:"test",baseExtent:[700068.029562,6163449.6181,738772.69842,6186567.15567],rotation:0,zShift:0.0,width:500.0,zExaggeration:0.0});

// Layer 0
lyr = project.addLayer(new Q3D.DEMLayer({q:1,shading:true,type:"dem",name:"Flat Plane"}));
bl = lyr.addBlock({width:2,plane:{width:1000.0,offsetX:0,offsetY:0,height:1000.0},m:0,sides:true,height:2}, false);
bl.data = [0,0,0,0];
lyr.stats = {max:0,min:0};
lyr.m[0] = {c:0x84a88d,type:0,ds:1};
