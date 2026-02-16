package project.test;
import java.util.Arrays;
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
        Weaver weaver = new Weaver();
    }


    @Test 
    public static void fourTabletsTest() {
        Tablet tablet1 = new Tablet(Arrays.asList("red", "red", "red", "white"));
        Weaver weaver = new Weaver(Arrays.asList( tablet1 ));
    }
}