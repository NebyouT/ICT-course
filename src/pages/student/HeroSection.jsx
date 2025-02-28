import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if(searchQuery.trim() !== ""){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("");
  }

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-600 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40 relative z-0">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          {/* Badge */}
          <div className="mt-8 sm:mt-12 lg:mt-4">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-semibold leading-6 text-purple-600 dark:text-purple-300 ring-1 ring-inset ring-purple-500/20">
                Latest Updates
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-300">
                <span>Just shipped v1.0</span>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </span>
            </a>
          </div>

          {/* Main heading */}
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Unlock Your Potential with Expert-Led Courses
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Discover a world of knowledge with our comprehensive online courses. Learn from industry experts and advance your career at your own pace.
          </p>

          {/* Search Form */}
          <form onSubmit={searchHandler} className="mt-8 relative max-w-lg">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses..."
                className="w-full h-14 pl-6 pr-32 rounded-full border-2 border-purple-100 dark:border-purple-900/50 bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl focus:border-purple-500 dark:focus:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 text-base"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white rounded-full px-6 h-10 text-sm shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Search
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Popular:</span>
              {['Web Development', 'Design', 'Business', 'Marketing'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/course/search?query=${tag}`);
                  }}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* CTA Buttons */}
          <div onClick={()=> navigate(`/course/search?query`)} className="mt-10 flex items-center gap-x-6">
            <Link to="/courses">
              <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white rounded-full px-8 py-6 text-base shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                Explore All Courses
              </Button>
            </Link>
            <Link to="/about" className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div>
              <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">Active Students</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">50k+</dd>
            </div>
            <div>
              <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">Expert Instructors</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">100+</dd>
            </div>
            <div>
              <dt className="text-base leading-7 text-gray-600 dark:text-gray-400">Course Success</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">95%</dd>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80"
              alt="App screenshot"
              width={2432}
              height={1442}
              className="w-[76rem] rounded-xl shadow-xl ring-1 ring-gray-400/10 dark:ring-gray-800/10"
            />
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-400 to-purple-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </div>
  );
};

export default HeroSection;
