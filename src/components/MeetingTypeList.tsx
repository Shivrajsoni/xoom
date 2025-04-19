"use client";

import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';

const MeetingTypeList = () => {
    const [meetingState,setMeetingState] = useState<'isInstantMeeting'| 'isJoiningMeeting' | 'isScheduleMeeting' | undefined>(undefined);
    const router = useRouter();
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <HomeCard
         img="/icons/add-meeting.svg"
         title="New Meeting"
         description="Start an instant meeting"
         className='bg-green-300'
         handleClick={() => setMeetingState('isInstantMeeting')}
        />

        <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        className="bg-blue-400"
        handleClick={() => setMeetingState('isJoiningMeeting')}/>
        
        <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        className="bg-purple-400"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        />
        <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Meeting Recordings"
        className="bg-yellow-500"
        handleClick={() => router.push('/recordings')}
        />

    </section>
  )
}

export default MeetingTypeList
