import React, { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // or another theme you want to use

interface CodePopupInterface {
  callBackToSaveContent(value: string): void;
  whichFeaturePopupToShow: "" | "code" | "image" | "emoji" | "gif" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "link"
}


const CodePopup = ({ whichFeaturePopupToShow, callBackToSaveContent }: CodePopupInterface) => {

  function formatCodeSyntax(text: string) {
    return Prism.highlight(text, Prism.languages.javascript, 'javascript');
  }

  const [text, setText] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    callBackToSaveContent(event.target.value);
  }

  return (
    <div className={`absolute flex-col-reverse ${whichFeaturePopupToShow === 'code' ? "flex md:grid" : "hidden"} md:grid-rows-0 md:grid-cols-2 z-40 h-[60%] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto bg-[#191825] rounded-lg p-3`}>
      <textarea cols={30} className='p-3' rows={10} value={text} onChange={(e) => handleChange(e)} />
      <pre className='p-3 whitespace-pre-wrap overflow-y-auto h-[100%]'>
        <code dangerouslySetInnerHTML={{ __html: formatCodeSyntax(text) }} />
      </pre>
    </div>
  )
}

export default CodePopup;