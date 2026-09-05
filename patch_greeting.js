import fs from 'fs';
let code = fs.readFileSync('js/messenger.js', 'utf8');

code = code.replace(
  'হ্যালো! আমি LoveWeb এর এআই অ্যাসিস্ট্যান্ট। কীভাবে আপনাকে সাহায্য করতে পারি?', 
  'হ্যালো! আমি LoveWeb এর এআই অ্যাসিস্ট্যান্ট। আমি আপনার নতুন অর্ডার প্লেস করা থেকে শুরু করে অর্ডারের বর্তমান অবস্থা (Status) চেক করাসহ যেকোনো বিষয়ে সাহায্য করতে পারি। কীভাবে সাহায্য করতে পারি?'
);

fs.writeFileSync('js/messenger.js', code);
console.log('Updated greeting');
