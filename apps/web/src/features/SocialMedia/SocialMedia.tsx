import Link from 'next/link';
import React from 'react';
import {
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

export default function SocialMedia() {
  return (
    <div>
      <div className="flex flex-col">
        <h3 className="text-lg mb-4">Connect with us</h3>
        <div className="flex space-x-4 justify-center md:justify-start">
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <FaFacebookSquare className="w-7 h-7" />
          </Link>
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <FaSquareXTwitter className="w-7 h-7" />
          </Link>
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <FaGithubSquare className="w-7 h-7" />
          </Link>
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <FaLinkedin className="w-7 h-7" />
          </Link>
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <FaInstagram className="w-7 h-7" />
          </Link>
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <FaYoutube className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </div>
  );
}
