// import { NextResponse } from 'next/server';
// import type { Strategy } from '@/types/strategy';

// export async function POST(request: Request) {
//   try {
//     const strategy: Strategy = await request.json();
    
//     // 这里调用后端的策略执行逻辑
//     // 可以直接调用之前写的 Python 代码，或者调用专门的策略服务
    
//     // 示例响应
//     return NextResponse.json({
//       success: true,
//       results: [
//         // 符合条件的股票列表
//       ]
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Strategy execution failed' },
//       { status: 500 }
//     );
//   }
// } 