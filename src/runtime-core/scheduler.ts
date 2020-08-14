const queue: any[] = [];

const p = Promise.resolve()
let isFlushedPending = false;

export function nextTick(fn: any) {
  return fn ? p.then(fn) : p
}

export function queueJob(job: any) {
  if (!queue.includes(job)) {
    queue.push(job)
    // 执行所有的 job
    queueFlush()
  }
}

function queueFlush() {
   // 如果同时触发了两个组件的更新的话
   // 这里就会触发两次 then（微任务逻辑）
   // 但是这是没有必要的
   // 我们只需要触发一次即可处理完所有的 job 调用
   // 所以需要判断一下 如果已经触发过nextTick 了
   // 那么后面就不需要再次触发一次 nextTick 逻辑了
   if (isFlushedPending) return;
   isFlushedPending = true;
   nextTick(flushJobs);
}

function flushJobs() {
   isFlushedPending = false;
   let job;
   while (job = queue.shift) {
       job && job()  
   }
}