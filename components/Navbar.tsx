"use client";
import React from "react";
import Link from "next/link";

// Components
import Logo from "@/components/Logo";

// Hooks
import { usePlayerModal } from "@/utils/logic";

const Navbar: React.FC = () => {
  const { openModal } = usePlayerModal();

  return (
    <header className="App-header">
      <Link href="/" className="app-title">
        <Logo size={32} />
        <span>Futsal Team Manager</span>
      </Link>
      <div className="header-actions">
        <Link href="/" className="nav-link">
          Players
        </Link>
        <Link href="/vote" className="nav-link">
          Vote
        </Link>
        <Link href="/team-generator" className="nav-link">
          Team Generator
        </Link>
        <button className="nav-link add-button" onClick={openModal}>
          Add Player
        </button>
      </div>
    </header>
  );
};

export default Navbar;
