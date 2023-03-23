import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // or another theme you want to use
import { useSelector } from 'react-redux';
import { UserSelector } from '../redux/userSlice';

interface ContentWrapperProp {
    children: string;
    itm: any;
}

const ContentWrapper = ({ children, itm }: ContentWrapperProp) => {

    const selector = useSelector((state: UserSelector) => state.user);

    function formatCodeSyntax(text: string) {
        return Prism.highlight(text, Prism.languages.javascript, 'javascript');
    }

    const [code, setcode] = useState('');
    const [link, setlink] = useState('');
    const [p, setp] = useState('');
    const [image, setimage] = useState('');
    const [heading, setheading] = useState(['', 0]);

    useEffect(() => {
        if (children.slice(0, 6) === '[code]') {
            let splittingCode = children.split("[code]")[1];
            splittingCode = splittingCode.split("[/code]")[0];
            setcode(splittingCode);
        } else if (children.slice(0, 6) === '[link]') {
            let splittingLink = children.split('[link]')[1];
            splittingLink = splittingLink.split("[/link]")[0];
            setlink(splittingLink);
        } else if (children.slice(0, 3) === '[p]') {
            let splittingP = children.split('[p]')[1];
            splittingP = splittingP.split("[/p]")[0];
            setp(splittingP);
        } else if (children.slice(0, 7) === '[image]') {
            let splittingImage = children.split('[image]')[1];
            splittingImage = splittingImage.split("[/image]")[0];
            console.log(splittingImage);
            setimage(splittingImage);
        }
        manageHeading(1);
        manageHeading(2);
        manageHeading(3);
        manageHeading(4);
        manageHeading(5);
        manageHeading(6);
    }, []);

    function manageHeading(count: number) {
        if (children.slice(0, 4) === `[h${count}]`) {
            let splittingHeading = children.split(`[h${count}]`)[1];
            splittingHeading = splittingHeading.split(`[/h${count}]`)[0];
            setheading([splittingHeading, count]);
        }
    }

    return (
        <>
            {
                code.length > 0 
                ? <div className={`${itm.sendBy === selector._id
                    ? "self-end bg-white dark:bg-gray-800 m-3 rounded-tl-3xl rounded-br-3xl"
                    : "self-start bg-green-500 m-3 rounded-tr-3xl rounded-bl-3xl"
                    }`}>
                    <pre className='p-3 whitespace-pre-wrap overflow-y-auto h-[100%]'>
                        <code dangerouslySetInnerHTML={{ __html: formatCodeSyntax(code) }} />
                    </pre>
                </div>
                    : <div className={`break-words ${itm.sendBy === selector._id
                        ? "self-end bg-white dark:bg-gray-800 m-3 rounded-tl-3xl rounded-br-3xl"
                        : "self-start bg-green-500 m-3 rounded-tr-3xl rounded-bl-3xl"
                        } h-max max-w-[250px] p-3`}>
                        {image ? <img src={image} alt='send_image' /> : link ?
                            <a className='underline text-blue-600 cursor-pointer' target='_blank' href={link}>{link}</a>
                            : p ? p : heading && heading[0]}
                    </div>
            }
        </>
    )
}

export default ContentWrapper;