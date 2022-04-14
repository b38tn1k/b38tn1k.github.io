---
layout: post
title:  "Safety in Robotics Research is a Long Sprint"
date:   2022-01-20
categories: [robots, ux, safety]
comments: True
sitemap:
  lastmod: 2022-01-20
  priority: 1.0
  changefreq: 'monthly'
  exclude: 'yes'
---

I work in robotics research. My team and I focus on applying emerging robotics tech to IRL applications. The nature of this work requires us to figure out what various robots can do and how that could be useful. This work requires experimenting with robots and occasionally breaking them. Breaking stuff is something that happens in research. Sometimes the best way to learn is to break something (even if you didn't intend to). Breaking robots is expensive, can create project blockers, and, without proper planning, can be dangerous.

The majority of robots my team work on are unstable when they lose power. Remove the compute or power from a hovering drone or standing legged robot and it crashes to the ground. sad face. Different robots have different applications, capabilities, and limitations. Planning a safe experiment should always begin with consideration of the specific characteristics of the robot; determining an operating procedure. But there are also many commonalities between robots.

When my team runs a robot experiment we do all the usual stuff; we verify code in sim, we define safe areas, we assign team roles (remote pilot in command, robot spotter, civilian and wildlife spotter, documenter / videographer...), we keep track of anything interesting, we work standard operating procedures reviewed by dedicated safety engineers... We've been working together for long enough that the safety mindset is just an automatic, implicit part of our team culture.

Recently I was asked codify our safety methods to help stand up another robotics group, putting it down on paper provided an opportunity to reflect. My team does a wonderful job at planning experiments but I believe our biggest strength is our resilience to guilt and blame when something goes wrong. When something goes wrong in an experiment, the first question is 'is everyone ok?' (given). The second is 'what did we learn?'. Breaking a robot during an experiment is a learning event.

In the reverse scenario; when something happens and the robot breaks and you were the remote pilot in control, feelings of guilt can emerge. When some asks you 'what did you do?' it feels even worse. Guilt is irrational; you do everything correct and the robot still breaks and you feel like it was your fault. Guilt means you don't wanna talk about what happened. Which makes it hard to learn anything. Reacting to safety events with guilt and blame is a dangerous path, with compounding results.

so.. back to codifying our safety approach. Creating the 'anti-guilt, anti-blame' mindset in a new group of people who do not know each other poses some challenges. In my team it emerged organically from our work, starting on smaller robots and experiments and building up to the 'big time' with constant guidance and feedback from various safety experts in the org. At the same time we were building trust and understanding in each other, stuff that isn't immediately available in a fresh team.

Providing the new group with a data dump of safety expert contacts, SOPs and root cause analysis reports seemed like assigning homework that probably wouldn't get done. Also, if one team member did their homework, how do they know the other team members did too? Just providing the information doesn't help create the culture. Building 'guilt resilience' into a group from scratch requires building trust; 'I know that you know that I know'.

*so... cover the lab with informational posters!
ehhh...
um... group activities?
maybe? probably?
Is this, like, a UX problem?
yeh, I guess*

**How do you rapidly create a safety-positive culture in a research group of new people?**

- don't make safe experiment planning feel like homework.
- make safety conversations structured enough to be comfortable and avoid playing the blame/guilt game.
- make it part of experiment planning from day 0, with a view towards the future.

Coming up with a safe experiment plan on your own is a difficult task that typically falls on the lead researcher. Considering every edge case and then owning the plan can be daunting, especially when you are sharing to a wider group of people. Communal ownership of such a plan is way easier.

To create a communally owned safety plan methodology, I stole some ideas from the (very dry) Failure Modes and Effects Analysis process and 'smushed' it into a Design Sprint-style ideation session. Instead of ideating on user stories, wants and needs, we could build on experiment stories, failure modes, and behaviours. I call it a Safety Sprint and it's more fun than it sounds.

# Safety Sprint

Typically, design sprints are used to achieve *something* in a predetermined time frame. Design sprints kick off with planning and understanding. Safety Sprints are the same. Design sprints can end with a retrospective exercise, providing all involved the opportunity to reflect and improve processes in future sprints. In a Safety Sprint, the design retrospective is repurposed as an 'Unplanned Learning Event' retrospective. The outcomes of this retrospective can be fed back into the safe experiment plan. In a Safety Sprint, unlike a Design Sprint, the time frame is unknown.

```
               ┌──────────────────┐
               │                  │
       ┌──────►│  Create a Plan   ├───────┐
       │       │                  │       │
       │       └──────────────────┘       │
       │                                  │
       │                                  │
┌──────┴──────────┐              ┌────────▼──────┐
│                 │              │               │────┐
│  Retrospective  │              │  Do Research  │    │ Regular check-ins with the plan
│                 │              │               │◄───┘
└─────▲───────────┘              └─────────┬─────┘
      │                                    .
      │                                    .   Unknown amount of time
      │    ┌──────────────────────────┐    .
      │    │                          │    .
      └────┤  A Learning Event Occurs │◄───┘
           │                          │
           └──────────────────────────┘

```

## Safety Sprint Kick Off
Group creation of safe robot operating procedures can be done in-person using Post-Its or, more easily, a white-boarding app like Miro. The idea is to ~~force~~ allow everyone to contribute. A session opens with a 5 min presentation from the lead researcher on the robot hardware and planned application. Then the group works through a series of prompt questions. The answers to a prompt become inputs to the next prompt question (a digital white board with copy/paster is very useful here). A session looks like this:

- Introduction by lead researcher
- Group activity responding to prompts:
  1. What does the robot have to do to achieve what you are planning?
  2. What could go wrong?
  3. What would be the result of that failure mode?
  4. What would cause that failure mode?
  5. What could prevent such a failure mode?
  6. Is there anything else we should thing about when working with this robot?
- Conclusion

### Robot Introduction by lead researcher
The lead researcher shares some information about the robot as well as their high level aspirations, for example:

*'I want this autonomous forklift to move inventory from the back of the semi-trailer to the correct location in the warehouse. It has 2 drive wheels and two free-rolling wheels for stability. It uses a RealSense camera for navigation. It has a robotic arm attached that is guided by an additional camera + range finder. It runs on battery and can operate for 5 hours. It has IP54 protection.'*

### 1. What does the robot have to do to achieve what you are planning?
Basically a study in who was paying attention during the intro. The idea is to break the application into atomic Post-it sized chunks of information. Diversity of experience is really useful here; the computer vision focused engineer and the mechanical engineer will describe the robot tasks in different ways.
```
+---------------------------------------+-------------------------------------------------+
| enter truck trailer via ramp          | navigate a warehouse with pedestrians           |
+---------------------------------------+-------------------------------------------------+
| drive on flat and ramp surfaces       | place a box on a shelf                          |
+---------------------------------------+-------------------------------------------------+
| operating outdoors (loading dock)     | remove a box from a shelf                       |
+---------------------------------------+-------------------------------------------------+
| carry a box while driving down a ramp | receive inventory location information via WiFi |
+---------------------------------------+-------------------------------------------------+
```

### 2. What could go wrong?
Building upon the task breakdown above, determine failure modes for every step. The failure modes identified here are used and inputs for prompts 3 & 4. Using 'enter truck trailer via ramp' as example:
```
+------------------------------------+---------------------------------------+
| robot slides off ramp              | battery depletes on ramp              |
+------------------------------------+---------------------------------------+
| robot misaligns with ramp and tips | ramp collapses under robot weight     |
+------------------------------------+---------------------------------------+
| robot stalls on ramp               | robot exceeds rollover angle and tips |
+------------------------------------+---------------------------------------+
| robot falls off ramp               | ramp catches on fire                  |
+------------------------------------+---------------------------------------+
```
Some valid failure modes, some duplicates, some silly ones. It's all part of the project. And the silly ones occasionally lead to some unique insights.

### 3. What would be the result of that failure mode?
The more sobering and repetitive part of the exercise. But also the most motivating!
Building on 'robot slides off ramp':

```
+--------------------------+
| damage to robot          |
+--------------------------+
| damage to trailer        |
+--------------------------+
| damage to ramp           |
+--------------------------+
| pinching/crushing injury |
+--------------------------+
| damage to ground         |
+--------------------------+
| shock injury             |
+--------------------------+
```
Cake and grief counselling will be available at the conclusion of the test.

### 4. What would cause that failure mode?
From the failure modes identified in prompt 2, 'robot slides off ramp':

```
+-----------------------------------------------------------------------------------+
| sensor feedback failure on wheel / motor encoders                                 |
+-----------------------------------------------------------------------------------+
| failed detection of ramp in CV sensor                                             |
+-----------------------------------------------------------------------------------+
| ramp is wet due to rain                                                           |
+-----------------------------------------------------------------------------------+
| debris caught in wheel                                                            |
+-----------------------------------------------------------------------------------+
| sensor is occluded due to condensation / ∆temp between loading dock and warehouse |
+-----------------------------------------------------------------------------------+
| additional robot payload reduced rollover angle                                   |
+-----------------------------------------------------------------------------------+
```

### 5. What could prevent such a failure mode?
Taking each failure mode root cause from prompt 4, the group describes any potential risk mitigation strategies. Again, diversity of experience is super important here: People will see problems they can't solve. Others may know the solution but didn't even consider the problem. Using 'sensor feedback failure on wheel / motor encoders' as an example:

```
+---------------------------------------------------------------------------------+
| compare visual odometry with encoder output and notify operator upon divergence |
+---------------------------------------------------------------------------------+
| visually inspect the wheel cavities prior to operating the robot                |
+---------------------------------------------------------------------------------+
| ensure the operating area is clean, free of dust, water or debris               |
+---------------------------------------------------------------------------------+
```

### 6. Is there anything else we should thing about when working with this robot?
The lazy 'catch all' prompt at the end of the exercise that is preloaded with a few sub prompts to ensure the group has discussed all facets of safe robot operation:

- Maintenance
- Battery Charging
- Storage of equipment when not in use
- Training

### Conclusion of Kick Off exercise
Thank all involved in creating the plan and explain the concept of the Safety Sprint. Their involvement in any Learning Event Retrospectives is important! The lead researcher can take the group generated information and clean it up. Prompts 5 & 6 can be organised into a chronological order of operations that are then used as a basis for experiment procedure. Additional approval steps from safety experts and committees can be obtained using the 'cleaned up' experiment plan.
