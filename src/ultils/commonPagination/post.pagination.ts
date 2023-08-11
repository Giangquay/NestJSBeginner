export function  chunk(dataPost,pageDto) {
        const{page=1,limit=5}=pageDto;
        const totalPage = dataPost.length;
        const lastPage= Math.ceil(totalPage/limit);
        const nextPage = (parseInt(page) + 1 >lastPage) ? null: (parseInt(page) + 1);
        const prevPage = (page - 1 < 1 )? null :page-1;
        const arrayTempPost = []
        for (var i = 0; i < totalPage; i += limit) {
          arrayTempPost.push(dataPost.slice(i, i + limit))
         }
        
         return {
            post:arrayTempPost[page-1],
            meta:{
              totalPage:totalPage,
              next:nextPage,
              prev:prevPage,
              currentpage:parseInt(page)
            }
         }
}