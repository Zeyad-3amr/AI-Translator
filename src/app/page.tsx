'use client';
import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  // Progress,
} from '@heroui/react';

import { TbLanguage } from 'react-icons/tb';
import { BsSoundwave } from 'react-icons/bs';
import Loader from './components/Loader';

const languageOptions = [
  { name: 'Arabic', code: 'ar', flagUrl: 'https://flagcdn.com/w40/sa.png' },
  { name: 'Bengali', code: 'bn', flagUrl: 'https://flagcdn.com/w40/bd.png' },
  { name: 'Chinese ', code: 'zh', flagUrl: 'https://flagcdn.com/w40/cn.png' },
  { name: 'Dutch', code: 'nl', flagUrl: 'https://flagcdn.com/w40/nl.png' },
  { name: 'English', code: 'en', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { name: 'French', code: 'fr', flagUrl: 'https://flagcdn.com/w40/fr.png' },
  { name: 'German', code: 'de', flagUrl: 'https://flagcdn.com/w40/de.png' },
  { name: 'Hindi', code: 'hi', flagUrl: 'https://flagcdn.com/w40/in.png' },
  { name: 'Italian', code: 'it', flagUrl: 'https://flagcdn.com/w40/it.png' },
  { name: 'Japanese', code: 'ja', flagUrl: 'https://flagcdn.com/w40/jp.png' },
  { name: 'Korean', code: 'ko', flagUrl: 'https://flagcdn.com/w40/kr.png' },
  { name: 'Persian', code: 'fa', flagUrl: 'https://flagcdn.com/w40/ir.png' },
  { name: 'Portuguese', code: 'pt', flagUrl: 'https://flagcdn.com/w40/pt.png' },
  { name: 'Russian', code: 'ru', flagUrl: 'https://flagcdn.com/w40/ru.png' },
  { name: 'Spanish', code: 'es', flagUrl: 'https://flagcdn.com/w40/es.png' },
  { name: 'Swahili', code: 'sw', flagUrl: 'https://flagcdn.com/w40/ke.png' },
  { name: 'Thai', code: 'th', flagUrl: 'https://flagcdn.com/w40/th.png' },
  { name: 'Turkish', code: 'tr', flagUrl: 'https://flagcdn.com/w40/tr.png' },
  { name: 'Urdu', code: 'ur', flagUrl: 'https://flagcdn.com/w40/pk.png' },
  { name: 'Vietnamese', code: 'vi', flagUrl: 'https://flagcdn.com/w40/vn.png' },
];

export default function Home() {
  const [text, setText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(languageOptions[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState(languageOptions[4]);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSourceSpeaking, setIsSourceSpeaking] = useState(false);
  const [isTargetSpeaking, setIsTargetSpeaking] = useState(false);

  const handleTranslate = async () => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Translation error:', errorData);

        return;
      }

      const data = await res.json();
      console.log(data);
      if (data) {
        setTranslatedText(data);
      }
    } catch (err) {
      console.error('Error translating text:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    try {
      const res = await fetch('/api/speech', {
        method: 'POST',
        body: JSON.stringify({ text: text.trim() }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Speech error:', errText);
        setIsSpeaking(false);
        return;
      }

      const buffer = await res.arrayBuffer();
      if (!buffer) {
        console.error('No audio buffer received.');
        setIsSpeaking(false);
        return;
      }

      const blob = new Blob([buffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        console.log('Audio playback finished.');
        setIsSpeaking(false);
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
      };

      try {
        await audio.play();
      } catch (playbackError) {
        console.error('Error playing audio:', playbackError);
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error('Speech playback failed:', err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col max-w-7xl items-center justify-center mx-auto px-6  ">
      <div className=" max-w-4xl  w-full space-y-6   ">
        <div className="flex justify-center items-center mb-8 text-white gap-2">
          <h1
            className="text-3xl  font-bold text-center mb-3
            bg-gradient-to-r from-gray-100 via-gray-600 to-gray-200 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]
            "
          >
            GPTranslate
          </h1>
          <TbLanguage size={50} />
        </div>
        <div
          className="flex flex-col  items-center p-5  rounded border border-gray-400 
          bg-gradient-to-tl from-gray-950 via-gray-800 to-gray-950 animate-gradient-x bg-[length:800%_100%]
          w-full"
        >
          <div className=" flex justify-start w-full ">
            <div className="mb-4 flex justify-center items-center gap-3 ">
              <Dropdown>
                <DropdownTrigger className="flex ">
                  <Button
                    variant="bordered"
                    className=" text-lg text-gray-800 p-2 rounded-md w-40 border border-gray-400 font-semibold
                     transition-all duration-300 ease-in-out bg-gray-500 bg-gradient-to-r from-transparent via-gray-200 to-transparent hover:bg-gray-950 hover:from-transparent hover:via-gray-300 hover:shadow-sm hover:shadow-white
                      "
                  >
                    <img
                      src={sourceLanguage.flagUrl}
                      alt={sourceLanguage.name}
                      className="w-10 h-6 rounded shadow-sm shadow-blue-800"
                    />
                    {sourceLanguage.name}
                  </Button>
                </DropdownTrigger>

                <DropdownMenu
                  selectedKeys={sourceLanguage.name}
                  selectionMode="single"
                  onAction={(key) => {
                    const lang = languageOptions.find((l) => l.code === key);

                    if (targetLanguage.name !== lang?.name && lang) {
                      setSourceLanguage(lang);
                      setText('');
                    }
                  }}
                  className="bg-gray-400 border border-gray-200  w-full max-h-80 overflow-y-auto rounded-md shadow-lg shadow-gray-800 custom-scrollbar
                   bg-gradient-to-r from-transparent via-gray-500 to-transparent
                  "
                >
                  {languageOptions.map((lang) => (
                    <DropdownItem
                      key={lang.code}
                      className=" flex justify-start mb-2  hover:bg-gray-800 
                        rounded-md transition-all duration-100 ease-in-out "
                    >
                      <div className="flex gap-2 items-center min-w-full  p-2">
                        <img
                          src={lang.flagUrl}
                          alt={lang.name}
                          className="w-8 rounded-md h-5"
                        />
                        <span className="font-semibold">{lang.name}</span>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <textarea
            className="w-full h-full font-semibold p-3 border border-gray-400 rounded mb-4 focus:outline-none focus:ring-1  focus:border-white
                  bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 
                 placeholder:text-gray-600
            text-gray-900  resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            rows={4}
          />
          <div className="self-start ">
            <button
              onClick={() => handleSpeech(text)}
              disabled={isSpeaking}
              className={`flex items-center border border-gray-400 rounded py-1 px-3 shadow-sm shadow-gray-600 text-xl font-semibold transition-all duration-300 ease-in-out 
                bg-gray-500 bg-gradient-to-r from-transparent via-gray-200 to-transparent hover:bg-gray-950 hover:from-transparent hover:via-gray-300 hover:shadow-sm hover:shadow-white 
             ${
               isSpeaking
                 ? 'opacity-50 cursor-not-allowed bg-gray-950 hover:from-transparent hover:via-blue-700 '
                 : ''
             }
     `}
            >
              <BsSoundwave size={30} color="black" />
            </button>
          </div>

          <button
            onClick={handleTranslate}
            className="w-4/6 flex items-center justify-center text-lg text-gray-900 font-semibold py-2 px-4 rounded
            border border-gray-400 transition-all duration-300 ease-in-out bg-gray-500 bg-gradient-to-r  from-transparent via-gray-200 to-transparent
                    hover:bg-gray-950 hover:from-transparent hover:via-gray-300  hover:shadow-sm hover:shadow-white
            "
          >
            <TbLanguage size={30} />
            Translate
          </button>
        </div>
        <div
          className="border box-border p-4 rounded border-gray-400  w-full
        bg-gradient-to-bl from-gray-950 via-gray-800 to-gray-950 animate-gradient-x bg-[length:150%_100%]
        "
        >
          <div className="mb-4  flex justify-start items-center gap-3 ">
            <Dropdown>
              <DropdownTrigger className="flex ">
                <Button
                  variant="bordered"
                  className=" text-lg text-gray-800 p-2 rounded-md w-40 border border-gray-400 font-semibold
                    transition-all duration-300 ease-in-out bg-gray-500 bg-gradient-to-r from-transparent via-gray-200 to-transparent hover:bg-gray-950 hover:from-transparent hover:via-gray-300 hover:shadow-sm hover:shadow-white "
                >
                  <img
                    src={targetLanguage.flagUrl}
                    alt={targetLanguage.name}
                    className="w-10 h-6  rounded shadow-sm shadow-blue-800"
                  />
                  {targetLanguage.name}
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                selectedKeys={targetLanguage.name}
                selectionMode="single"
                onAction={(key) => {
                  const lang = languageOptions.find((l) => l.code === key);
                  if (sourceLanguage.name !== lang?.name && lang) {
                    setTargetLanguage(lang);
                  }
                }}
                className="bg-gray-950 border border-gray-500  w-full max-h-80 overflow-y-auto rounded-md shadow-lg shadow-gray-800 custom-scrollbar
                   bg-gradient-to-r  from-transparent via-gray-500 to-transparent
                  "
              >
                {languageOptions.map((lang) => (
                  <DropdownItem
                    key={lang.code}
                    className="flex justify-start mb-2  hover:bg-blue-800 
                      rounded-md transition-all duration-100 ease-in-out "
                  >
                    <div className="flex gap-2  items-center min-w-full  p-2">
                      <img
                        src={lang.flagUrl}
                        alt={lang.name}
                        className="w-8 rounded-md h-5 "
                      />
                      <span className="font-semibold">{lang.name}</span>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          {!isLoading ? (
            <div
              className="w-full  font-semibold bg-gray-900  p-4 border border-gray-400 rounded mb-4 text-gray-200 
            focus:outline-none focus:ring-1  focus:border-blue-400
               bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 
            "
            >
              <p className="text-white">{translatedText}</p>
            </div>
          ) : (
            <div className="flex p-2 justify-center items-center">
              <Loader />
            </div>
          )}
          <div className="text-gray-800">
            <button
              onClick={() => handleSpeech(translatedText)}
              disabled={isSpeaking}
              className={`flex items-center border border-gray-400 rounded py-1 px-3 shadow-sm shadow-gray-600 text-xl font-semibold transition-all duration-300 ease-in-out 
             bg-gray-500 bg-gradient-to-r from-transparent via-gray-200 to-transparent hover:bg-gray-950 hover:from-transparent hover:via-gray-300 hover:shadow-sm hover:shadow-white 
          ${
            isSpeaking
              ? 'opacity-50 cursor-not-allowed bg-gray-950 hover:from-transparent hover:via-blue-700 '
              : ''
          }
  `}
            >
              <BsSoundwave size={30} color="black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
