(() => {
  const context = document.modelContext;
  if (!context || !context.registerTool) return;
  const controller = new AbortController();
  const tool = {
    name: 'search_columns_news',
    title: '보도자료 검색',
    description: '화면의 보도자료 제목 검색을 실행하고 표시된 원문 링크를 반환합니다. 현재 분류를 유지합니다.',
    inputSchema: {type:'object',properties:{query:{type:'string'}},required:['query'],additionalProperties:false},
    annotations: {readOnlyHint:false,untrustedContentHint:true},
    execute(input) {
      if (!input || typeof input.query !== 'string' || Object.keys(input).some(k => k !== 'query')) throw new Error('query 문자열을 입력하세요.');
      const search = document.getElementById('newsSearch');
      if (!search || !window.SNB_DATA.news) throw new Error('뉴스를 불러온 뒤 다시 검색하세요.');
      search.value = input.query;
      search.dispatchEvent(new Event('input',{bubbles:true}));
      return {query:search.value,results:Array.from(document.querySelectorAll('#newsList a')).map(a=>({title:a.textContent.trim(),url:a.href}))};
    }
  };
  try { Promise.resolve(context.registerTool(tool,{signal:controller.signal})).catch(()=>{}); } catch(e) {}
  window.addEventListener('pagehide',()=>controller.abort(),{once:true});
})();
