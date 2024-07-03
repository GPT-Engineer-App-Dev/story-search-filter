import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchTopStories = async () => {
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await res.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyRes.json();
    })
  );
  return stories;
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stories, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <aside className="w-1/4 p-4">
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </aside>
      <main className="w-3/4 p-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-24 mb-4" />
          ))
        ) : (
          filteredStories?.map((story) => (
            <Card key={story.id} className="mb-4">
              <CardHeader>
                <CardTitle>
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
                    {story.title}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{story.score} upvotes</p>
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
};

export default Index;
