import { faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "@tanstack/react-router";
import { ReactNode } from "react";
import { TextAnimator } from "./text-animator";

const Navbar = ({ children }: { children: ReactNode }) => {
  return (
    <nav className="relative z-10 flex justify-between px-4 bg-slate-800 bg-opacity-50 py-1">
      {children}
    </nav>
  );
};

const bottomNodes = [
  <label>
    Giveaway de <span className="text-gamdom">$500</span> a los 2000 follows en
    Kick y 200 follows en X <span className="text-gamdom">!sorteo</span>
  </label>,
  <label>
    Torneo mensual entre los 10 primeros en puntos y watchtime{" "}
    <span className="text-gamdom">!top</span>
  </label>,
];

const commandNodes = [
  <ul className="flex gap-4 items-center justify-end">
    <li>!ttssnow</li>
    <li>!tts22</li>
    <li>!ttsmasha</li>
    <li>!ttselm</li>
    <li>!ttsxokas</li>
    <li>!ttsdalas</li>
  </ul>,
  <ul className="flex gap-4 items-center justify-end">
    <li>!puntos</li>
    <li>!dado {"<apuesta>"}</li>
    <li>!ruletarusa {"<apuesta>"}</li>
    <li>!godmode</li>
    <li>!tip {"<usuario> <cantidad>"}</li>
  </ul>,
];

export const Layout = ({}) => {
  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        src="/bg.mp4"
      />
      <Navbar>
        <ul className="flex gap-4 items-center w-full">
          <li className="flex gap-2 items-center">
            <img src="/gamdom/logo.png" className="h-4" />
            <label>
              Sorteos todos los días entre cuentas registradas con el código{" "}
              <span className="text-gamdom">lawlsing</span> | !gamdom | !default
            </label>
          </li>
        </ul>
        <ul className="flex items-center gap-6 justify-end">
          <li className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faTwitter} />
            lawlsingslots
          </li>
          <li className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faYoutube} />
            lawlsing
          </li>
          <li className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faYoutube} />
            lawlsingvods
          </li>
        </ul>
      </Navbar>
      <div className="relative z-10 flex-grow flex items-center justify-center p-2">
        <Outlet />
      </div>
      <Navbar>
        <ul className="flex gap-4 items-center">
          <TextAnimator nodes={bottomNodes} />
        </ul>
        <ul className="flex gap-4 items-center justify-end">
          <TextAnimator nodes={commandNodes} />
        </ul>
      </Navbar>
    </div>
  );
};
