package project.test;
import java.util.List;

import org.junit.Before;
import org.junit.Test;

import project.Tablet;
import project.Weaver;

public class WeaverTest {
    Weaver weaver;

    @Before
    public static void setUp()
    {
        weaver = new Weaver();
    }


    @Test 
    public static void fourTabletsTest() {
        tablet1 Tablet = new Tablet({1,1,1,1});
        Weaver weaver = new Weaver(List.of( tablet1 ));
    }
}