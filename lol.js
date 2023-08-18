d1 = new Date()
d2 = new Date()
d2.setHours(d2.getHours() + 2);



console.log(d1.getTime() - d2.getTime())