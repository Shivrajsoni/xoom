"use client";

import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast } from "sonner"

const initalValue = {
  dateTime:new Date(),
  description:'',
  link:'',
}

const MeetingTypeList = () => {
    const [meetingState,setMeetingState] = useState<'isInstantMeeting'| 'isJoiningMeeting' | 'isScheduleMeeting' | undefined>();
    const router = useRouter();
    const {user} = useUser();
    const client = useStreamVideoClient();
    
    const [values,setValues] = useState(initalValue);
    const [callDetails,setCallDetails] = useState<Call>();
    
    const createMeeting = async() =>{
      if(!user || !client) return ;
      
      try {
        if (!values.dateTime) {
          toast('Please select a date and time');
          return;
        }
        const id = crypto.randomUUID();
        const call = client.call('default',id);
        if (!call) throw new Error('Failed to create meeting');
        const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        const description = values.description || 'Instant Meeting';
        
        await call.getOrCreate({
          data:{
            starts_at:startsAt,
            custom:{
              description,
            },
          }
        });

        setCallDetails(call);
        if(!values.description){
          router.push(`/meeting/${call.id}`);
          toast('Meeting Created');
        }
      
      } catch (error) {
        console.log(error);
        toast('Failed to Create Meeting');
      }

    }
  
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

        <MeetingModal
        isOpen = {meetingState==='isInstantMeeting'}
        onClose = {()=>setMeetingState(undefined)}
        title = 'Start an Instance Meeting'
        className = 'text-center'
        buttonText = 'Start Meeting'
        handleClick = {createMeeting}
        />

    </section>
  )
}

export default MeetingTypeList
